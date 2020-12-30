import mongoose from "mongoose";
import { esClient } from '../../elastic-search';
import { log } from "../../log";
const Types = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  email: {
    type: Types.String,
    unique: true
  },
  password: {
    type: Types.String
  },
  locale: {
    type: Types.String
  },
}, {
  collection: 'user',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});
userSchema.index({ email: 'text' }, { name: 'email_text', background: true });
userSchema.index({ locale: 'text' }, { name: 'locale_text', background: true });

const User = mongoose.model('User', userSchema);

const cursor = User.watch([], { fullDocument: 'updateLookup' });
cursor.on('change', (doc) => {

  if (doc.operationType === 'insert') {

    const { email, locale, _id } = doc.fullDocument;

    try {
      esClient.index({ index: 'users', type: 'userstype', body: { email, locale }, id: _id })
    } catch (error) {
      log.error('esClient insert user');
      console.log(JSON.stringify(error, null, '\t'))
    }

  }

});
cursor.on('error', (err) => log.error('user cursor error'));
cursor.on('end', () => log.info('user cursor end'));
cursor.on('resumeTokenChanged', (token) => log.info('user cursor token'));

export { User };

