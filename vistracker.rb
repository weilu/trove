require 'thor'
require_relative 'lib/data_generator'

class Vistracker < Thor
  desc "generate TOKEN PROJECT_ID", "fetch and generate formatted story data for the given project"
  def generate(token, project_id)
    stories = fetch_stories token, project_id
    csv = DataGenerator.new(stories).generate

    File.open('stories.csv', 'w') do |f|
      f.puts csv
    end
  end

  desc "aggregate TOKEN PROJECT_ID", "fetch and aggregate story data for the given project"
  def aggregate(token, project_id)
    stories = fetch_stories token, project_id
    csv = DataGenerator.new(stories).generate_summary

    File.open('stories_aggregated.csv', 'w') do |f|
      f.puts csv
    end
  end

  private

  def fetch_stories token, project_id
    PivotalTracker::Client.token = token
    PivotalTracker::Client.use_ssl = true

    PivotalTracker::Project.find(project_id).stories.all
  end
end

Vistracker.start
