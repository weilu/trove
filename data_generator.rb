require 'csv'
require 'pivotal-tracker'

class DataGenerator

  def initialize stories
    @stories = stories
    grouped = stories.group_by{|s| s.story_type}
    @releases = grouped['release']
    @features = grouped['feature']


    grouped = stories.
      select{|s| %w(release feature).include?(s.story_type)}.
      group_by{|s| [ s.story_type, s.labels ]}
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
