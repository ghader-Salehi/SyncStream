import axios from "axios";
import queryString from 'query-string'

import { YOUTUBE_SEARCH_URL, YOUTUBE_API_KEY } from "config"

export const getYouTubeSearchResult = async(query : string , videoType = 'any' ) =>{
    console.log(YOUTUBE_API_KEY);
    
    const params = queryString.stringify ( {
        videoType,
        'key': YOUTUBE_API_KEY,
        'q': query,
        'part': 'snippet',
        'type': 'video',
        'maxResults': 50
    } )

    return await axios.get(`${YOUTUBE_SEARCH_URL}?${params}`)
}