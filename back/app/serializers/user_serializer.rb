class UserSerializer
  include JSONAPI::Serializer
  attributes :id, :uid, :email, :balance, :caution_lv, :warning_lv
end