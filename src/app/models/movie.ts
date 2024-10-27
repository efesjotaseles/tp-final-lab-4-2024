export interface MovieSearch {
    page:          number;
    results:       Result[];
    total_pages:   number;
    total_results: number;
}

export interface Result {
    adult:             boolean;
    backdrop_path:     null | string;
    genre_ids:         number[];
    id:                number;
    original_language: string;
    original_title:    string;
    overview:          string;
    popularity:        number;
    poster_path:       null | string;
    release_date:      string;
    title:             string;
    video:             boolean;
    vote_average:      number;
    vote_count:        number;
}

/**
 * @param include_adult defaults to false
 * @param language defaults to en-US
 * @param page defaults to 1
 */
export interface MovieQueryParams {
    query: string,
    include_adult?: boolean,
    language?: string,
    primary_release_year?: string,
    page?: number,
    region?: string,
    year?: string
}
