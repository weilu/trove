require 'data_generator'

describe DataGenerator do
  def new_feature i, options
    PivotalTracker::Story.new({
      story_type: 'feature',
      name: "feature #{i}",
      estimate: options[:estimate] || i,
      labels: options[:labels],
      current_state: options[:current_state]
    })
  end

  let(:stories) do
    [
      new_feature(1, labels: 'admin,shopping', current_state: 'accepted'),
      new_feature(1, labels: 'blog', current_state: 'accepted', estimate: -1),
      PivotalTracker::Story.new(story_type: 'release', name: 'release 1'),

      new_feature(2, labels: 'shopping', current_state: 'delivered'),
      new_feature(2, labels: 'checkout,admin', current_state: 'unstarted'),
      new_feature(2, labels: 'checkout', current_state: 'unstarted'),
      new_feature(2, labels: 'checkout', current_state: 'unstarted', estimate: -1),
      PivotalTracker::Story.new(story_type: 'release', name: 'release 2'),

      PivotalTracker::Story.new(story_type: 'feature', name: 'feature 3')
    ]
  end
  let(:generator) { described_class.new stories }

  describe '#generate' do
    subject(:csv_data) { CSV.parse generator.generate }

    it 'generates headers' do
      expect(csv_data[0]).to eq %w(release tag status points)
    end

    it 'populates the rest of the columns' do
      expect(csv_data[1..-1]).to eq([
        ['release 1', 'admin', 'accepted', '1'],
        ['release 1', 'blog', 'accepted', '0'],
        ['release 2', 'shopping', 'delivered', '2'],
        ['release 2', 'checkout', 'planned', '4']
      ])
    end
  end

  describe '#generate_summary' do
    subject(:csv_data) { CSV.parse generator.generate_summary }

    it 'generates headers' do
      expect(csv_data[0]).to eq ['tag', 'release 1', 'release 2']
    end

    it 'populates the rest of the columns' do
      expect(csv_data[1..-1]).to eq([
        ['admin', '1', '0'],
        ['blog', '0', '0'],
        ['shopping', '0', '2'],
        ['checkout', '0', '4']
      ])
    end
  end
end

