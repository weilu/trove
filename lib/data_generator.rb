require 'csv'
require 'pivotal-tracker'
require_relative 'pivotal_tracker/story'

class DataGenerator

  def initialize stories
    PivotalTracker::Story.assign_releases(stories)
    @features = stories.select(&:feature?).select(&:has_release?)
    @releases = stories.select(&:release?)
  end

  def generate
    CSV.generate do |csv|
      csv << %w(release tag status points)

      @features.group_by do |f|
        [f.release.name, f.tags.first, f.normalized_state]
      end.each do |key, stories|
        csv << key + [
          stories.reduce(0) do |memo, s|
            s.estimate.to_i < 1 ? memo : memo += s.estimate.to_i
          end
        ]
      end
    end
  end

  def generate_summary
    CSV.generate do |csv|
      release_names = @releases.map(&:name)
      csv << ['tag'] + release_names

      result = Hash.new{|hash, key| hash[key] = Hash.new(0) }

      @features.each do |s|
        result[s.tags.first][s.release.name] += [s.estimate.to_i, 0].max
      end

      result.each do |tag, release_counts|
        csv << [tag] + release_names.map{ |r| release_counts[r] }
      end
    end
  end

end
