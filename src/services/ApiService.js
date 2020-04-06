import axios from "axios";
const apiEndPoint = window.location.protocol+'//'+window.location.host;
const axiosInstance = axios.create({
    baseURL: apiEndPoint,
});

// const data = {
//     "challengeQuestions": [
//         "What is your mother's maiden name?",
//         "What is your favorite color?",
//         "What is the name of your pet?",
//         "What is the city of your birth?",
//         "What highschool did you attend?",
//         "In what city did you meet your spouse/significant other?",
//         "What was your childhood nickname?",
//         "What street did you live on in third grade?",
//         "What is the name of your favorite childhood friend?",
//         "What is your oldest sibling's birth month and year?",
//         "What is the middle name of your oldest child?",
//         "What is your oldest sibling's middle name?"
//     ]
// }

// const userInfo = {
//     "challengeQuestions": [
//         "Who was your fifth grade teacher?",
//         "What street did you live on in third grade?",
//         "What is your oldest sibling's birth month and year?"
//     ],
//     "email": "Deepa.George@fdny.nyc.gov",
//     "firstName": "DEEPA",
//     "lastName": "GEORGE",
//     "userId": "11111",
//     "userLogin": "N1111111"
// }

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

    static async postMethod(url, data, headers, cancelToken) {
        const config = {
            headers: {
                ...(headers || {})
            }
        };
        if (cancelToken && cancelToken.token) {
            config.cancelToken = cancelToken.token;
        }
        let resData = '';
        const response = await axiosInstance.post(url, data, config).catch(thrown => {
            if (thrown.toString() === 'Cancel') {
                resData = 'cancel';
            } else {
                resData = {error: (thrown && thrown.response && thrown.response.data && thrown.response.data.message) || 'An error has occurred'};;
            }
        });
        return resData || response.data;
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
        // return userInfo
        // return await ApiService.getData(`GetUserInfo.json`);
        // return userName === "1234567" ? await ApiService.getData(`/SelfService/webapi/unauthapi/userInformation?userName=${userName || ''}`) : userInfo;
        return await ApiService.getData(`/SelfService/webapi/unauthapi/userInformation?userName=${userName || ''}`);
    }

    /*  Security Question Page Services  */
    async getChallengeQuestions() {
        // return data
        // return await ApiService.getData(`GetQuestions.json`);
        return await ApiService.getData(`/SelfService/webapi/unauthapi/allChallengeQuestions`);
    }

    async updateClaim(payload) {
        // return {"passwordError":"The following password policy rules were not met:Password must not be one of 6 previous passwords.","status":"success","userLogin":"0407143"}
        return await ApiService.postMethod(`/SelfService/webapi/unauthapi/claim`, payload);
    }
}
