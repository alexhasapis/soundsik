class Zip

#use the 'area' gem to validate if an address exists in the us
def self.validate_zip(zipcode)
  #if the to_region method is successful it returns
  #the valuse "City, State"
  if zipcode.to_region
    return zipcode.to_region
  else 
    return nil
  end
end

end