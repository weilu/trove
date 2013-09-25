module PivotalTracker
  class Story
    attr_accessor :release

    def tags
      labels.nil? ? ['untagged'] : labels.split(',')
    end

    def self.assign_releases stories
      releases = stories.select(&:release?)
      index = 0

      stories.each_with_index do |s, ii|
        if s.story_type == 'release'
          index += 1
        else
          s.release = releases[index]
        end
      end
    end

    [:feature, :bug, :release, :chore].each do |attr|
      define_method "#{attr}?" do
        story_type == attr.to_s
      end
    end

    def has_release?
      !release.nil?
    end
  end
end
