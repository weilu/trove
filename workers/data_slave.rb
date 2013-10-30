require 'sidekiq'
require_relative '../trove'

class DataSlave
  include Sidekiq::Worker
  sidekiq_options :queue => :default, :retry => false, :backtrace => true

  def perform(token, project_id)
    puts "DataSlave at work..."
    trove = Trove.new
    trove.generate(token, project_id)
    trove.aggregate(token, project_id)
  end
end
