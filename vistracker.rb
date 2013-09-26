require 'thor'
require_relative 'lib/data_generator'

class Vistracker < Thor
  desc "generate TOKEN PROJECT_ID", "fetch and generate formatted story data for the given project"
  def generate(token, project_id)
    PivotalTracker::Client.token = token
    PivotalTracker::Client.use_ssl = true

    stories = PivotalTracker::Project.find(project_id).stories.all
    csv = DataGenerator.new(stories).generate

    File.open('stories.csv', 'w') do |f|
      f.puts csv
    end
  end
end

Vistracker.start
