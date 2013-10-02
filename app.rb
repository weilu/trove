require 'sinatra'

set :public_folder, File.dirname(__FILE__) + '/javascript'

get '/' do
  File.read('index.html')
end
