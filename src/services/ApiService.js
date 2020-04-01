import axios from "axios";
const apiEndPoint = window.location.protocol+'//'+window.location.host;
const axiosInstance = axios.create({
    baseURL: apiEndPoint,
});

const questions = {
    "challengeQuestions": [
        "What is your mother's maiden name?",
        "What is your favorite color?",
        "What is the name of your pet?",
        "What is the city of your birth?",
        "What highschool did you attend?",
        "In what city did you meet your spouse/significant other?",
        "What was your childhood nickname?",
        "What street did you live on in third grade?",
        "What is the name of your favorite childhood friend?",
        "What is your oldest sibling's birth month and year?",
        "What is the middle name of your oldest child?",
        "What is your oldest sibling's middle name?"
    ]
};

const user = {
    "userLogin": "123456",
    "firstName": "User1",
    "lastName": "Demo",
    "dob": "12/08/1995",
    "last4ofSSN": "12/22/2020",
    "email": "test@gmail.com",
    "middleName": "TestUser",
    "password": "TestPassword",
    "confirmPassword": "TestPassword",
    "challengeQuestions": [
        "What is your mother's maiden name?",
        "What is your favorite color?",
        "What is the name of your pet?",
        "What is the city of your birth?",
        "What highschool did you attend?",
        "In what city did you meet your spouse/significant other?",
        "What was your childhood nickname?",
        "What street did you live on in third grade?",
        "What is the name of your favorite childhood friend?",
        "What is your oldest sibling's birth month and year?",
        "What is the middle name of your oldest child?",
        "What is your oldest sibling's middle name?"
    ]
};

export class ApiService {

    static async getData(url, headers, cancelToken, data) {
        const config = {
            headers: {
                ...(headers || {}),
                'Content-Type': 'application/json'
            },
        };
        if (data) {
            config.data = data;
        }
        if (cancelToken && cancelToken.token) {
            config.cancelToken = cancelToken.token;
        }
        const response = await axiosInstance.get(url, config).catch((err) => {
            data = {error: (err && err.response && err.response.data && err.response.data.message) || 'An error has occurred'};
        });
        return data || response.data;
    }

    static async putMethod(url, data, headers, cancelToken) {
        const config = {
            headers: {
                ...(headers || {})
            }
        };
        if (cancelToken && cancelToken.token) {
            config.cancelToken = cancelToken.token;
        }
        let resData = '';
        const response = await axiosInstance.put(url, data, config).catch(thrown => {
            if (thrown.toString() === 'Cancel') {
                resData = 'cancel';
            } else {
                resData = {error: (thrown && thrown.response && thrown.response.data && thrown.response.data.message) || 'An error has occurred'};;
            }
        });
        return resData || response.data;
    }

    async getUserInformation(userName) {
        // return user
        return await ApiService.getData(`/SelfService/webapi/unauthapi/userInformation?userName=${userName || ''}`);
    }

    /*  Security Question Page Services  */
    async getChallengeQuestions() {
        // return questions;
        return await ApiService.getData(`/SelfService/webapi/unauthapi/allChallengeQuestions`);
    }

    async updateClaim(payload) {
        return await ApiService.putMethod(`/SelfService/webapi/authapi/claim`, payload);
    }
}
