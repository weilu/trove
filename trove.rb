#!/usr/bin/env ruby
require 'thor'
require_relative 'lib/data_generator'

class Trove < Thor
  desc "generate TOKEN PROJECT_ID", "fetch and generate formatted story data for the given project"
  def generate(token, project_id)
    setup token, project_id

    File.open(data_dir_and_prefix + "stories.csv", 'w') do |f|
      f.puts @data_generator.generate
    end
  end

  desc "aggregate TOKEN PROJECT_ID", "fetch and aggregate story data for the given project"
  def aggregate(token, project_id)
    setup token, project_id

    File.open(data_dir_and_prefix + 'stories_aggregated.csv', 'w') do |f|
      f.puts @data_generator.generate_summary
    end
  end

  private

  def setup(token, project_id)
    @token = token
    @project_id = project_id
    @data_generator ||= DataGenerator.new(fetch_stories)
  end

  def fetch_stories
    PivotalTracker::Client.token = @token
    PivotalTracker::Client.use_ssl = true
    PivotalTracker::Project.find(@project_id).stories.all
  end

  def data_dir_and_prefix
    "public/data/#{@token}#{@project_id}"
  end
end

Trove.start
