// import { axiosInstance } from './axiosInstance';
// import useStore from '../store/userInformation';

// // 수정 <- 수정완료 되면 삭제해주세요 !

// export async function postRefreshToken(email) {
//     try {
//         const response = await axiosInstance.post('/auth/refresh', {
//             email: email, // 이메일을 리프레시 토큰 발급 요청에 사용
//         });
//         return response;
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

// export async function postLogin(email, password) {
//     try {
//         const response = await axiosInstance.post('/auth/signin', {
//             email: email,
//             password: password,
//         });
//         // 로그인 성공 후 사용자 정보 zustand store에 저장
//         if (response.status === 200) {
//             const { user } = response.data.result;
//             console.log('로그인 성공:', response.data.result);
//             useStore.getState().setUser(user);
//         }

//         return response;
//     } catch (error) {
//         if (error.response && error.response.status === 400) {
//             return 400;
//         }
//         throw error;
//     }
// }

// export async function getLogout() {
//     try {
//       const token = sessionStorage.getItem("access_token");
//       const response = await axiosInstance.get("/auth/signout", null, {
//         headers: {
//           Authorization: token,
//         },
//       });
//       return response;
//     } catch (error) {
//       console.error("로그아웃 에러", error);
//       throw error;
//     }

//   }
