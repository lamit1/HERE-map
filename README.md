# HERE-map

# Tech stack:
- FE: 
    + TailwindCSS: [Link](https://mui.com/)
    + React: [Link](https://react.dev/)
    + MUI: [Link](https://tailwindcss.com/)
    + Vite: [Link](https://vitejs.dev/)
- BE: 
    + NodeJS + TypeScript: [Link](https://nodejs.org/en)
    + Fastify: [Link](https://fastify.dev/)
- Related links: 
    + Here api: [Link](https://developer.here.com/develop/javascript-api)
    + Mapquest graphql api: [Link](https://graphql.aws.mapquest.com/)
    + Mapquest location crawl url: [Link](https://www.mapquest.com/sitemap.xml)
    + Google studio AI: [Link](https://aistudio.google.com/)
    + Kibana: [Link](https://www.elastic.co/kibana) (For testng with elasticsearch)
# Stack Version:
- Elasticsearch: 18.2.2
- Nodejs: 21.7.3
- All others dependecies can see at 'server/src/package.json' and 'client/here-app/package.json'
# Project structure:
- client: 
    - public/assets: Storing images files.
    - src:
        - components: Storing React components file.
            + article: components about places suggestion article.
            + detail: components about location detail.
            + direction: components about location direction.
            + search: components about location search.
        - graphql:
            + api: for calling server api.
            + query: graphql query.
        - hooks: React custom hooks.
        - layout: React Layout components (SideBar, Map, Header, Container, ...)
        - utils: helper functions
- server: 
    - jsonDownloader: Downloading json file to crawling location.  
    - crawler: Crawling location detail and prompting article based on Gemini.
    - search: search server for client call through graphql api.
# How to run project
1. Clone project.
2. Set up config.
- cd client/here-app -> npm install
- cd server/src -> npm install  
- config .env file: 
3. Run projects command
- FE: 
    - cd client/here-app
    - npm run dev.
- BE:
    - cd server/src
    - Download locations json files: npm run downloader.
    - Running crawler: npm run crawler.
    - Running server: npm start.
# Functionality:
    - Locations search: Search nearby location based on coordinate of user and their query String (Completed)
    - Location detail: Get location detail info by id (Completed)
    - Location routing: Get routing planner using here service (Completed)
    - Print instruction: Print the routing instruction (Completed)
    - Places review. (On going...)
# Some image relate
![image](https://github.com/lamit1/HERE-map/assets/84758368/e41b3c20-af7d-400b-92e3-b9cced03d9bb)
![image](https://github.com/lamit1/HERE-map/assets/84758368/020185b5-6547-433c-a229-1c1c3aa23067)
![image](https://github.com/lamit1/HERE-map/assets/84758368/a93f4928-3043-45a6-8c35-250550960b77)

