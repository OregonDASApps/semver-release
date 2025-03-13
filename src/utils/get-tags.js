'use strict';

import _ from 'lodash';
import { graphql } from "@octokit/graphql";

export default class GetReleaseTags {

    constructor() {

    }
 
    getTags(jsonObj) {
        return jsonObj;
    }


    async getAllTags(owner, repo, myToken) {
        const graphqlWithAuth = graphql.defaults({
            headers: {
                authorization: `token ${myToken}`,
            },
        });
    
            let hasNextPage = true;
            let endCursor = null;
            let allTags = [];
            
            while (hasNextPage) {
                let response = await graphqlWithAuth(
                    `
                    query ($cursor: String) {
                        repository(owner: "${owner}", name: "${repo}") {
                        releases(first: 100, after: $cursor, orderBy: {field: CREATED_AT, direction: DESC}) {
                            nodes {
                                name
                                createdAt
                                tagName
                            }
                            pageInfo {
                                startCursor
                                endCursor
                                hasNextPage
                            }
                        }
                        }
                    }
                    `,
                    {
                        owner: owner,
                        repo: repo,
                        cursor: endCursor,
                    }
                );
        
                let releases = await response.repository.releases;
                
                hasNextPage = releases.pageInfo.hasNextPage;
                endCursor = releases.pageInfo.endCursor;

                allTags = allTags.concat(releases.nodes);
                if(!hasNextPage) break;

            }
       
            return allTags;
        
    }

    async getAllTags2(owner, repo, myToken) {
        const graphqlWithAuth = graphql.defaults({
            headers: {
                authorization: `token ${myToken}`,
            },
        });
 
        return await graphqlWithAuth(
            `
              {
                
                repository(owner: "${owner}", name: "${repo}") {
                    
                    releases(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
                            nodes {
                            name
                            createdAt
                            tagName
                        }
                    }
                }
              }
            `
        );       
    }
}