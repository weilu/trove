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

    describe '.assign_releases' do
      it 'assign a release to every feature' do
        feature1 = Story.new(story_type: 'feature')
        release1 = Story.new(story_type: 'release')
        feature2 = Story.new(story_type: 'feature')
        release2 = Story.new(story_type: 'release')
        feature3 = Story.new(story_type: 'feature')

        stories = [feature1, release1, feature2, release2, feature3]
        Story.assign_releases stories
        expect(feature1.release).to eq(release1)
        expect(feature2.release).to eq(release2)
        expect(feature3.release).to be_nil
      end
    end

    describe '#feature?' do
      example { Story.new(story_type: 'feature').should be_feature }
      example { Story.new(story_type: 'bug').should_not be_feature }
    end

    describe '#release?' do
      example { Story.new(story_type: 'release').should be_release }
      example { Story.new(story_type: 'feature').should_not be_release }
    end

    describe '#has_release?' do
      example { Story.new(release: 'a release').should have_release }
      example { Story.new.should_not have_release }
    end

    describe '#normalized_state' do
      example { expect(Story.new(current_state: 'accepted').normalized_state).to eq 'accepted' }
      example { expect(Story.new(current_state: 'delivered').normalized_state).to eq 'delivered' }
      %w(finished started unstarted unscheduled rejected).each do |state|
        example { expect(Story.new(current_state: state).normalized_state).to eq 'planned' }
      end
    end
  end
end
