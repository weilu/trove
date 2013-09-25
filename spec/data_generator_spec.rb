require_relative '../data_generator'
require 'pry'

describe DataGenerator do
  let(:stories) { YAML.load_file('fixtures/stories.yaml') }
  let(:generator) { described_class.new stories }

  describe '#generate' do
    subject(:data) { CSV.parse generator.generate }

    it 'generates headers' do
      expect(data[0]).to eq %w(release tag status stories)
    end

    it 'populates release column' do
      expect(data[1..-1].map(&:first).uniq).to eq(
        [
          "Initial demo to investors",
          "Beta launch",
          "Full production launch"
        ]
      )
    end
  end
end

