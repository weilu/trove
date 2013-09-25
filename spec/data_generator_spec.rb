require_relative '../data_generator'
require 'pry'

describe DataGenerator do
  let(:stories) { YAML.load('fixtures/stories.yaml') }
  let(:generator) { described_class.new stories }

  describe '#generate' do
    subject(:data) { CSV.parse generator.generate }

    it 'generates headers' do
      expect(data[0]).to eq %w(release tag status stories)
    end
  end
end

