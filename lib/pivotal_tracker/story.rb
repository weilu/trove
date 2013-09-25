module PivotalTracker
  class Story
    def tags
      labels.nil? ? ['untagged'] : labels.split(',')
    end

    def self.group_by_releases stories
      result = {}

      releases = stories.select{|s| s.story_type == 'release'}
      indexes = releases.map{|r| stories.index(r)}.sort.unshift(-1)
      indexes.each_with_index do |i, ii|
        next if i < 0
        start_index = indexes[ii-1] + 1
        result[stories[i]] = stories[start_index...i]
      end

      result
    end
  end
end
