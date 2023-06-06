import Api from "./Api";

class MeetingsApi extends Api {
	constructor() {
		super("/meetings"); // Set the appropriate base URL for meetings endpoint
	}

	static async getAllMeetings() {
		return await this.get();
	}

	async createMeeting(data) {
		return await this.post("", data);
	}
}

export default MeetingsApi;
