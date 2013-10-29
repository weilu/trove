require 'sidekiq'
require_relative '../trove'

class DataSlave
  include Sidekiq::Worker

  def perform(token, project_id)
    trove = Trove.new
    trove.generate(token, project_id)
    trove.aggregate(token, project_id)
  end
end
