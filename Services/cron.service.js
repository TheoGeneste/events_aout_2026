import cron from 'node-cron';
import eventsModel from '../Models/events.model.js';
import mailService from './mail.service.js';

 function testCron(){
    cron.schedule('* 8 * * *', async () => {
        const participants = await eventsModel.getParticipantForEvent();
        console.log(participants);
        for(const participant of participants){
            await mailService.rappelEvent(participant.us_email, participant.ev_title, participant.ev_date, participant.ev_location);
        }
    }, function(error) {
        console.error(error);
    }, function() {
        console.log('cron job started');
    }, true);
}

export default { testCron };