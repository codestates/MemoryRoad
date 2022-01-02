/* [ action 예시 ]
 *
 * // 액션 타입을 선언합니다
 * const GET_USER_INFO = 'get/user/userInfo' as const;
 *
 * // 액션 생성함수를 선언합니다
 * export const getUserInfo = (id: number) => ({
 *   type: GET_USER_INFO,
 *   payload: id
 * });

 * // 모든 액션 객체에 대한 타입을 내보냅니다
 * // reducer의 인자(초기상태, 액션) 중 액션 인자의 타입을 정의할 때 쓰입니다 :)
 * export type Action = 
 *   | ReturnType<typeof getUserInfo>;
 */

export {}