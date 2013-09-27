Trove
=====================

PivotalTracker releases visualized.

![screen shot 2013-09-27 at 9 44 24 pm](https://f.cloud.github.com/assets/412533/1226159/0dc14366-277b-11e3-9fe3-246abcc9f3d0.png)

## Usage

Check out the visualization with a sample project [here](http://weilu.github.io/trove/)

To visualiza your own project, you will need your PivotalTracker API token (under profile) and project ID.

    bundle
    ruby ./trove.rb generate TOKEN PROJECT_ID
    ruby ./trove.rb aggregate TOKEN PROJECT_ID
    python -m SimpleHTTPServer
    
Visit [http://localhost:8000](http://localhost:8000) to see your tracker project visualized.

## Licence

MIT
