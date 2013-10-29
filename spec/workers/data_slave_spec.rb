require_relative '../../workers/data_slave'

describe DataSlave do
  describe '#perform' do
    it 'generates data using Trove' do
      token = '123'
      project_id = 'abc'
      trove = double(:trove)

      Trove.should_receive(:new).and_return(trove)
      trove.should_receive(:generate).with(token, project_id)
      trove.should_receive(:aggregate).with(token, project_id)

      DataSlave.new.perform token, project_id
    end
  end
end

