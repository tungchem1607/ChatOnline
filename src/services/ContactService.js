import UserModel from '../models/userModel';
import ContactModel from '../models/contactModel';
import _ from 'lodash';

class ContactService{ 

  findUsersContact(currentUserId, keyword){
    return new Promise(async(resolve, reject) => {
      let deprecatedUserIds = [currentUserId];
      let contactsByUser = await ContactModel.findAllByUser(currentUserId);
      contactsByUser.forEach((contact) =>{
        deprecatedUserIds.push(contact.userId);
        deprecatedUserIds.push(contact.contactId);
      });

      deprecatedUserIds = _.uniqBy(deprecatedUserIds);
      let users = await UserModel.findAllForAddContact(deprecatedUserIds, keyword);
      resolve(users);
    });
  }
}

module.exports = new ContactService