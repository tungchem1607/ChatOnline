import {notification, contact, message} from './../services';
import {bufferToBase64, lastItemOfArray, convertTimestampToHumanTime} from './../helpers/clientHelper';
class HomeController {
    async getHome(req, res) {
        // only 10 items one time
        let notifications = await notification.getNotifications(req.user._id);
        // get amount notifications unread
        let countNotifUnread = await notification.countNotifUnread(req.user._id);
        // get contacts 10 items one time
        let contacts = await contact.getContacts(req.user._id)
        // get contacts sent 10 items one time
        let contactSent = await contact.getContactSent(req.user._id)
        // get contacts received 10 items one time
        let contactReceived = await contact.getContactReceived(req.user._id)
        // count contacts
        let countAllContacts = await contact.countAllContacts(req.user._id)
        let countAllContactsSent = await contact.countAllContactsSent(req.user._id)
        let countAllContactsReceived = await contact.countAllContactsReceived(req.user._id)

        let getAllConversationItems = await message.getAllConversationItems(req.user._id);
        // all message with conversation max 30 item
        let allConversationsWithMessages = getAllConversationItems.allConversationsWithMessages;


        return res.render('main/home/home', {
            errors: req.flash('errors'),
            success: req.flash('success'),
            user: req.user,
            notifications: notifications,
            countNotifUnread: countNotifUnread,
            contacts: contacts,
            contactSent: contactSent,
            contactReceived: contactReceived,
            countAllContacts: countAllContacts,
            countAllContactsSent: countAllContactsSent,
            countAllContactsReceived: countAllContactsReceived,
            allConversationsWithMessages: allConversationsWithMessages,
            bufferToBase64: bufferToBase64,
            lastItemOfArray: lastItemOfArray,
            convertTimestampToHumanTime: convertTimestampToHumanTime
        });
    }
}
module.exports = new HomeController;