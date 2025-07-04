import { useState } from "react";
import { Rocket, MapPin, Briefcase, Thermometer, Satellite, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Ticket } from "lucide-react";


interface Planet {
  id: string;
  name: string;
  image: string;
  description: string;
  temperature: string;
  satellites: string;
  funFact: string;
}

interface TripPlan {
  travelPlan: string;
  gear: string[];
  temperature: string;
  satellites: string;
  funFact: string;
  ticketId: string;
  travelDuration: string;
  distanceLightYears: string;
  spaceShuttle: string; 

}

export default function SolarTourism() {
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const { toast } = useToast();

  const { data: planets = [] } = useQuery({
    queryKey: ['/api/planets'],
    queryFn: async () => {
      const { default: planetsData } = await import("@/data/planets.json");
      return planetsData;
    }
  });
 const travelPlanTemplates = [
  (planetName: string) => `Embark on a thrilling voyage to ${planetName}, where futuristic propulsion systems will carry you across the cosmos. Witness interstellar dust storms, pass through asteroid belts, and marvel at the celestial beauty that surrounds your route.`,
  (planetName: string) => `Prepare for an epic expedition to ${planetName}, a multi-month journey that will immerse you in the silence of space, cosmic radiation dances, and the wonders of gravitational slingshots. Ideal for adventurers seeking the ultimate galactic thrill.`,
  (planetName: string) => `Your mission to ${planetName} begins with a launch through the mesosphere, climbing beyond Earth’s gravity well into deep space. You’ll experience cosmic radiation shielding, stellar views, and alien terrain upon arrival.`,
  (planetName: string) => `Venture to ${planetName} aboard a next-generation star cruiser equipped with AI navigation and cryo-sleep pods. Traverse asteroid highways, glimpse passing comets, and approach the majestic body with awe and curiosity.`,
  (planetName: string) => `Launch toward ${planetName} for a transformative space odyssey. This interplanetary route includes gravitational boosts from nearby planets, panoramic views of dying stars, and deep-space silence broken only by your thoughts.`,
  (planetName: string) => `Your cosmic journey to ${planetName} will span light-days of travel. Equipped with zero-gravity living modules and augmented reality windows, the craft offers a front-row seat to the evolving story of our solar system.`,
  (planetName: string) => `Fasten in for a breathtaking ride to ${planetName}. With ion engines humming and starfields dancing outside your cabin, this isn’t just a voyage—it’s an awakening of the explorer within you.`,
  (planetName: string) => `Soar across vast expanses of space toward ${planetName}, passing planetary rings, frozen moons, and solar flares. Advanced shielding tech ensures your safety while nature delivers the jaw-dropping spectacle of the void.`,
  (planetName: string) => `Journey to ${planetName} through a meticulously charted trajectory, encountering Lagrange points and space stations en route. Expect a scientifically engineered adventure wrapped in a cinematic experience.`,
  (planetName: string) => `Brace yourself for an unforgettable trip to ${planetName}, curated by astro-tourism experts. Traverse through time dilation pockets, witness the curvature of space, and arrive ready to walk on alien soil.`
];


  const generateTripMutation = useMutation({
    mutationFn: async (planetId: string) => {
      const webhookUrl = import.meta.env.VITE_N8N_TOURISM_WEBHOOK || '';
      
      if (!webhookUrl) {
        // Fallback to static data
        const planet = planets.find((p: Planet) => p.id === planetId);
        if (!planet) throw new Error('Planet not found');
        
        return {
          travelPlan: travelPlanTemplates[Math.floor(Math.random() * travelPlanTemplates.length)](planet.name),
          gear: planet.gear,
          temperature: planet.temperature,
          satellites: planet.satellites,
          funFact: planet.funFact,
          ticketId: `TCK-${Math.floor(100000 + Math.random() * 900000)}`,
          travelDuration: planet.travelDuration,
          distanceLightYears: planet.distanceLightYears,
          spaceShuttle: planet.spaceShuttle
        };
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planet: planetId })
      });

      if (!response.ok) {
        throw new Error('Failed to generate trip plan');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setTripPlan(data);
      toast({
        title: "Trip Plan Generated!",
        description: "Your space tourism plan is ready for review.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate trip plan. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handlePlanetSelect = (planetId: string) => {
    setSelectedPlanet(planetId);
    setTripPlan(null);
  };

  const handleGenerateTrip = () => {
    if (!selectedPlanet) {
      toast({
        title: "No Destination Selected",
        description: "Please select a planet before generating a trip plan.",
        variant: "destructive",
      });
      return;
    }
    generateTripMutation.mutate(selectedPlanet);
  };

  return (
    <section id="tourism" className="py-20 relative">
      <div className="container mx-auto px-6">
        <motion.h2 
          className="text-4xl md:text-6xl text-center mb-16"
          style={{ fontFamily: 'Orbitron, monospace' }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-orange-400 to-purple-400 bg-clip-text text-transparent">
            Solar System Tourism
          </span>
        </motion.h2>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              className="glass-morphism rounded-xl p-8"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl mb-6" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(207, 90%, 54%)' }}>
                Choose Your Destination
              </h3>
              <div className="max-h-[400px] overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-transparent p-3">
                <div className="grid grid-cols-2 gap-3">
                  {planets.map((planet: Planet) => (
                    <motion.div
        key={planet.id}
        className={`rounded-lg p-4 cursor-pointer transition-colors group ${
          selectedPlanet === planet.id ? 'ring-2 ring-blue-400' : ''
        }`}
        style={{ backgroundColor: 'hsl(220, 69%, 36%, 0.2)' }}
        onClick={() => handlePlanetSelect(planet.id)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src={planet.image} 
          alt={planet.name}
          className="w-full h-24 object-cover rounded-lg mb-3"
        />
        <h4 className="font-semibold text-center transition-colors group-hover:text-orange-400">
          {planet.name}
        </h4>
        <p className="text-xs text-gray-400 text-center">{planet.description}</p>
      </motion.div>
    ))}
  </div>
</div>

              
              <Button
                onClick={handleGenerateTrip}
                disabled={generateTripMutation.isPending || !selectedPlanet}
                className="w-full mt-6 glow-button bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-400/80 hover:to-purple-400/80"
              >
                <Rocket className="w-4 h-4 mr-2" />
                {generateTripMutation.isPending ? 'Generating...' : 'Generate Trip Plan'}
              </Button>
            </motion.div>
            
            <motion.div 
              className="glass-morphism rounded-xl p-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl mb-6" style={{ fontFamily: 'Orbitron, monospace', color: 'hsl(35, 91%, 48%)' }}>
                Trip Details
              </h3>
              
              {tripPlan ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-2" style={{ color: 'hsl(207, 90%, 54%)' }} />
                      Travel Plan
                    </h4>
                    <p className="text-gray-300 text-sm">{tripPlan.travelPlan}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2" style={{ color: 'hsl(207, 90%, 54%)' }} />
                      Travel Gear Needed
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {tripPlan.gear.map((item, index) => (
                        <span key={index} className="px-2 py-1 rounded text-sm" style={{ backgroundColor: 'hsl(220, 69%, 36%, 0.3)' }}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Thermometer className="w-4 h-4 mr-2" style={{ color: 'hsl(207, 90%, 54%)' }} />
                        Temperature
                      </h4>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(35, 91%, 48%)' }}>
                        {tripPlan.temperature}
                      </p>
                    </div>

                    {/* Travel Duration */}
<div>
  <h4 className="font-semibold mb-2 flex items-center">
    <Rocket className="w-4 h-4 mr-2" style={{ color: 'hsl(207, 90%, 54%)' }} />
    Travel Duration
  </h4>
  <p className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(35, 91%, 48%)' }}>
    {tripPlan.travelDuration}
  </p>
</div>

{/* Distance from Earth */}
<div>
  <h4 className="font-semibold mb-2 flex items-center">
    <MapPin className="w-4 h-4 mr-2" style={{ color: 'hsl(207, 90%, 54%)' }} />
    Distance from Earth
  </h4>
  <p className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(35, 91%, 48%' }}>
    {tripPlan.distanceLightYears}
  </p>
</div>

                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Satellite className="w-4 h-4 mr-2" style={{ color: 'hsl(207, 90%, 54%)' }} />
                        Nearby Satellites
                      </h4>
                      <p style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(35, 91%, 48%)' }}>
                        {tripPlan.satellites}
                      </p>
                    </div>
                  </div>
        
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center">
                      <Star className="w-4 h-4 mr-2" style={{ color: 'hsl(207, 90%, 54%)' }} />
                      Fun Fact
                    </h4>
                    <p className="text-gray-300 text-sm">{tripPlan.funFact}</p>
                  </div>
{/* Ticket ID & Space Shuttle Side-by-Side */}
{tripPlan.ticketId && tripPlan.spaceShuttle && (
  <div className="grid grid-cols-2 gap-4">
    {/* Ticket ID */}
    <div>
      <h4 className="font-semibold mb-2 flex items-center">
        <Ticket className="w-4 h-4 mr-2" style={{ color: 'hsl(207, 90%, 54%)' }} />
        Ticket ID
      </h4>
      <p className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(291, 81%, 60%)' }}>
        {tripPlan.ticketId}
      </p>
    </div>

    {/* Space Shuttle */}
    <div>
      <h4 className="font-semibold mb-2 flex items-center">
        <Briefcase className="w-4 h-4 mr-2" style={{ color: 'hsl(207, 90%, 54%)' }} />
        Space Shuttle
      </h4>
      <p className="text-sm" style={{ fontFamily: 'JetBrains Mono, monospace', color: 'hsl(291, 81%, 60%)' }}>
        {tripPlan.spaceShuttle}
      </p>
    </div>
  </div>
)}

                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  <Rocket className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Select a planet and generate your trip plan to see details here.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
