describe Trove do
  let(:generator) { double :generator, generate: 'generate!', generate_summary: 'generate_summary!' }
  let(:stories) { double :stories }

  before do
    DataGenerator.stub(:new).and_return(generator)
    PivotalTracker::Project.stub_chain(:find, :stories, :all).and_return(stories)
  end

  describe '#generate' do
    let(:token) { '1234' }
    let(:project_id) { 'xxxx' }
    let(:filename) { "javascript/data/#{token}#{project_id}stories.csv" }

    subject(:generate) { Trove.new.generate token, project_id }

    it 'fetches stories from tracker' do
      PivotalTracker::Client.should_receive(:token=).with(token)
      PivotalTracker::Client.should_receive(:use_ssl=).with(true)

      project = double :project
      PivotalTracker::Project.should_receive(:find).with(project_id).and_return(project)
      project.should_receive(:stories).and_return(stories)
      stories.should_receive(:all)

      generate
    end

    it 'generates data using DataGenerator' do
      generator.should_receive(:generate)

      generate
    end

    it 'writes the generated data into file' do
      generate

      expect(File.read(filename)).to eq("generate!\n")
    end

    after { File.delete filename }
  end

  describe '#aggregate' do
    let(:token) { '1234' }
    let(:project_id) { 'xxxx' }
    let(:filename) { "javascript/data/#{token}#{project_id}stories_aggregated.csv" }

    subject(:aggregate) { Trove.new.aggregate token, project_id }

    it 'fetches stories from tracker' do
      PivotalTracker::Client.should_receive(:token=).with(token)
      PivotalTracker::Client.should_receive(:use_ssl=).with(true)

      project = double :project
      PivotalTracker::Project.should_receive(:find).with(project_id).and_return(project)
      project.should_receive(:stories).and_return(stories)
      stories.should_receive(:all)

      aggregate
    end

    it 'generates data using DataGenerator' do
      generator.should_receive(:generate_summary)

      aggregate
    end

    it 'writes the generated data into file' do
      aggregate

      expect(File.read(filename)).to eq("generate_summary!\n")
    end

    after { File.delete filename }
  end
end
