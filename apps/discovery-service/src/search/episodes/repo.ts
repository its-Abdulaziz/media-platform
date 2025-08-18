
export interface EpisodeHit {

    program_id: string;      
    title: string;                       
    description: string | null;          
    media_url: string | null;            
    duration_seconds: number | null;     
    published_at: Date | null;           
    program_title?: string;  

  }
  
  export interface EpisodesSearchResult {
    items: EpisodeHit[];
    page: number;
    size: number;
  }
  
  export interface EpisodesSearchRepo {
    search(q: string, page: number, size: number): Promise<EpisodesSearchResult>;
  }
  