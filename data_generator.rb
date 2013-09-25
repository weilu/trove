require 'csv'

class DataGenerator

  def initialize stories
    @stories = stories
  end

  def generate
    CSV.generate do |csv|
      csv << %w(release tag status stories)
    end
  end

end
