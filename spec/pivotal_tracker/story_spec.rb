module PivotalTracker
  describe Story do
    describe '#tags' do
      it 'returns an array of tags/labels' do
        story = Story.new labels: 'admin,blog,generated content'
        expect(story.tags).to eq %w(admin blog generated\ content)
      end

      context 'when labels is nil' do
        it 'returns untagged' do
          story = Story.new
          expect(story.tags).to eq(['untagged'])
        end
      end
    end

    describe '.group_by_releases' do
      it 'returns a hash keyed by release stories' do
        feature1 = Story.new(story_type: 'feature')
        release1 = Story.new(story_type: 'release')
        feature2 = Story.new(story_type: 'feature')
        release2 = Story.new(story_type: 'release')
        feature3 = Story.new(story_type: 'feature')

        stories = [feature1, release1, feature2, release2, feature3]
        expect(Story.group_by_releases stories).to eq({
          release1 => [feature1],
          release2 => [feature2]
        })
      end
    end
  end
end
