import { useQuery } from "@tanstack/react-query";

const NASA_API_KEY = import.meta.env.VITE_NASA_API_KEY || 'DEMO_KEY';

export function useNasaApi(endpoint: string) {
  return useQuery({
    queryKey: [`/api/nasa/${endpoint}`],
    queryFn: async () => {
      switch (endpoint) {
        case 'apod':
          const apodResponse = await fetch('/api/nasa/apod');
          if (!apodResponse.ok) throw new Error('Failed to fetch APOD');
          return apodResponse.json();
          
        case 'iss':
          const issResponse = await fetch('/api/nasa/iss');
          if (!issResponse.ok) throw new Error('Failed to fetch ISS location');
          return issResponse.json();
          
        case 'moon':
          // Mock moon data - in production, integrate with moon phase API
          return {
            phase: 'Waxing Gibbous',
            illumination: '87%',
            nextFull: 'Dec 27, 2024',
            distance: '384,400 km'
          };
          
        default:
          throw new Error(`Unknown endpoint: ${endpoint}`);
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
  });
}
