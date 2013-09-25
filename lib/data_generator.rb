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
      csv << %w(release tag status stories)

      @features.group_by do |f|
        [f.release.name, f.tags.first, f.current_state]
      end.each do |key, stories|
        csv << key + [stories.count]
      end
    end
  end

end
