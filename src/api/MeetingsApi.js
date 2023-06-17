import Api from "./Api";

class MeetingsApi extends Api {
	constructor() {
		super("/meetings"); // Set the appropriate base URL for meetings endpoint
	}

	async getAllMeetings() {
		return await this.get();
	}

	async createMeeting(data) {
		return await this.post("", data);
	}

	async getMeetingById(meetingId) {
		return await this.get(`/${meetingId}`);
	}

	async updateMeetingById(meeting, data) {
		return await this.patchWithImages(`/${meeting.get('id')}`, data);
	}
}

export default MeetingsApi;
