import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser
  app.use(express.json());

  // API endpoints
  app.post("/api/insights", async (req, res) => {
    try {
      const { answers, emissions } = req.body;

      if (!answers || !emissions) {
        return res.status(400).json({ error: "Missing required inputs (answers or emissions)" });
      }

      const { transportType, distance, dietType, electricity, heatingType } = answers;
      const { transport, diet, energy, total } = emissions;

      // Determine highest category
      let highestCategory = "Transportation";
      let highestValue = transport;
      if (diet > highestValue) {
        highestCategory = "Diet";
        highestValue = diet;
      }
      if (energy > highestValue) {
        highestCategory = "Home Energy";
        highestValue = energy;
      }

      const apiKey = process.env.GEMINI_API_KEY;

      const fallbackTips = [
        {
          title: highestCategory === "Transportation" ? "Car-free Commute Days" : highestCategory === "Diet" ? "Transition to Mid-week Veg" : "Optimize Heating Setpoints",
          category: highestCategory,
          impact: highestCategory === "Transportation" ? `Saves ~${Math.round(transport * 0.25)} kg CO2/mo` : highestCategory === "Diet" ? `Saves ~${Math.round(diet * 0.20)} kg CO2/mo` : `Saves ~${Math.round(energy * 0.15)} kg CO2/mo`,
          description: highestCategory === "Transportation" 
            ? "Replacing your commute with walking, biking, or public transit just 1-2 days a week drastically shaves off tailpipe emissions."
            : highestCategory === "Diet"
            ? "Adopting a vegetarian or vegan menu for 2 days a week is an incredible way to reduce livestock resource-related greenhouse outputs."
            : "Lowering your winter indoor temperature by just 1-2°C or using smart schedules is the single most effective way to optimize electrical heating loads."
        },
        {
          title: "Optimize Appliance Loads",
          category: "Home Energy",
          impact: `Saves ~${Math.round(energy * 0.1)} kg CO2/mo`,
          description: "Wash clothes in cold water (30°C or below) and air dry instead of using the tumble dryer to easily cut residential laundry power usage by 75%."
        },
        {
          title: "Introduce Meat-free Lunches",
          category: "Diet",
          impact: "Saves ~18 kg CO2/mo",
          description: "Replacing red meats with plant-based proteins such as lentils, chickpeas, or tofu for lunches can drop meal footprints by nearly half."
        }
      ];

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        console.warn("GEMINI_API_KEY not configured or using default placeholder. Serving intelligent fallback insights.");
        return res.json({ tips: fallbackTips });
      }

      // Initialize Gemini Client with correct headers and API key from process env
      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });

      const promptString = `
        You are a sustainability research expert. Analyze the customer's carbon profile:
        - Monthly emissions: Transportation is ${transport} kg, Diet is ${diet} kg, Home Energy is ${energy} kg. Total is ${total} kg.
        - Inputs: Commutes with ${transportType} for ${distance} km monthly. Diet is ${dietType}. Electricity is ${electricity} kWh monthly with ${heatingType} heating.
        Their highest impact category is "${highestCategory}".
        
        Generate exactly 3 personalized, actionable, concrete suggestions for behavior change.
        Each tip must show clear savings in CO2 kg per month specifically matching their profile.
        Keep the descriptions encouraging, descriptive but non-preachy, and strictly under 2 sentences.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptString,
        config: {
          systemInstruction: "You are an specialized energy auditor and sustainability advisor. You formulate strict practical, local-scale advice. Always provide real numbers and estimates.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              tips: {
                type: Type.ARRAY,
                description: "List of 3 concrete personalized sustainability suggestions",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: {
                      type: Type.STRING,
                      description: "Short, catchy action-oriented headline. Max 5 words."
                    },
                    category: {
                      type: Type.STRING,
                      description: "The category must be 'Transportation', 'Diet', or 'Home Energy'"
                    },
                    impact: {
                      type: Type.STRING,
                      description: "Estimated monthly impact, e.g. 'Saves ~24 kg CO2/mo'"
                    },
                    description: {
                      type: Type.STRING,
                      description: "Encouraging, concrete description of why and how to execute this."
                    }
                  },
                  required: ["title", "category", "impact", "description"]
                }
              }
            },
            required: ["tips"]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsedData = JSON.parse(responseText.trim());
        if (parsedData.tips && parsedData.tips.length > 0) {
          return res.json({ tips: parsedData.tips });
        }
      }

      // Return fallback if parsed response is empty/corrupt
      return res.json({ tips: fallbackTips });

    } catch (error) {
      console.error("Gemini API error during insights generation:", error);
      // Serve fallbacks on error so the app continues seamlessly
      return res.json({
        tips: [
          {
            title: "Swap Driving for Active Commutes",
            category: "Transportation",
            impact: "Saves ~35 kg CO2/mo",
            description: "Try walking or cycling for short trips under 3km. It reduces peak tailpipe carbon and improves cardiovascular wellness."
          },
          {
            title: "Plan Two Meatless Days Weekly",
            category: "Diet",
            impact: "Saves ~20 kg CO2/mo",
            description: "Transitioning a few dinners per week to legumes, vegetables, and grains drastically drops agricultural pressure."
          },
          {
            title: "Install LED Lighting",
            category: "Home Energy",
            impact: "Saves ~12 kg CO2/mo",
            description: "Replace remaining incandescent bulbs with energy-efficient LEDs, which consume up to 85% less electricity."
          }
        ]
      });
    }
  });

  // Serve Vite app in dev, or static bundle in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EcoTrack dev/prod server is up and listening on http://localhost:${PORT}`);
  });
}

startServer();
