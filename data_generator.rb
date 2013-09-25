require 'csv'
require 'pivotal-tracker'

class DataGenerator

  def initialize stories
    @stories = stories
    @releases = stories.select{|s| s.story_type == 'release'}
  end

  def generate
    CSV.generate do |csv|
      csv << %w(release tag status stories)
      @releases.each do |r|
        csv << [ r.name ]
      end
    end
  end

end
