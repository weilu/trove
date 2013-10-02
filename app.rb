require 'sinatra'
require 'haml'
require_relative 'trove'

set :public_folder, File.dirname(__FILE__) + '/javascript'

get '/' do
  haml :index, locals: { credentials: "#{params[:tracker_api_token]}#{params[:project_id]}" }
end

post '/' do
  token = params[:tracker_api_token]
  project_id = params[:project_id]

  trove = Trove.new
  trove.generate(token, project_id)
  trove.aggregate(token, project_id)

  redirect "/?tracker_api_token=#{token}&project_id=#{project_id}"
end
