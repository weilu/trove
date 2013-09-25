describe DataGenerator do
  let(:stories) { YAML.load_file('fixtures/stories.yaml') }
  let(:generator) { described_class.new stories }

  describe '#generate' do
    subject(:csv_data) { CSV.parse generator.generate }
    def data_column index
      csv_data[1..-1].map{|row| row[index]}
    end

    it 'generates headers' do
      expect(csv_data[0]).to eq %w(release tag status stories)
    end

    it 'populates release column' do
      expect(data_column(0).uniq).to eq(
        [
          "Initial demo to investors",
          "Beta launch",
          "Full production launch"
        ]
      )
    end

    it 'populates tag column' do
      expect(data_column(1).uniq).to eq(
        ["admin", "shopping", "cart", "search", "checkout", "orders",
         "signup / signin", "shopper accounts", "design",
         "user generated content", "featured products", "blog"]
      )
    end
  end
end

