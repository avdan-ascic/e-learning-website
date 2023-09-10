import app from './app'
import mongoose from 'mongoose'

import config from './config'
import User from './models/user.model'


app.listen(config.port, err => {
  if (err) return console.log(err)
  console.log(`Server started on port ${config.port}`)
})

mongoose.connect(config.mongo)
  .then(() => console.log('MongoDB connected successfully'))
  .then(async () => {
    // Add predifined admin user if not added already
    const admin = await User.findOne({ email: 'paragon@paragon.ba' })
    let user
    if (!admin) {
      user = new User({
        firstName: 'Admin',
        lastName: 'Paragon',
        email: 'paragon@paragon.ba',
        password: 'Paragon202!',
        role: 'admin',
        active: true
      })
      await user.save()
    }
  })
  .catch(err => console.log(err))