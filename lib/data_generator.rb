require 'csv'
require 'pivotal-tracker'
require_relative 'pivotal_tracker/story'

class DataGenerator

  def initialize stories
    PivotalTracker::Story.assign_releases(stories)
    @features = stories.select(&:feature?).select(&:has_release?)
  end

  def generate
    CSV.generate do |csv|
      csv << %w(release tag status points)

      @features.group_by do |f|
        [f.release.name, f.tags.first, f.normalized_state]
      end.each do |key, stories|
        csv << key + [ stories.reduce(0){|memo, s| memo += s.estimate} ]
      end
    end
  end

end
