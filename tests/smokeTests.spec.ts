import { test } from '../utils/fixtures';
import {expect} from '@playwright/test';
import { getAccessToken } from '../helpers/getAccessToken.ts';
import videogame_payload from '../request-payloads/videogame_post.json';

test.describe('Video Game API', () => {

    test.beforeAll('Get API Token', async ({ api, config}) => { 
        await getAccessToken();
    });

    test('Authentication should fail with invalid credentials @VIDEOGAME_API_01', async ({ api}) => {
        const response = await api
            .path('/api/authenticate')
            .body({username: 'test', password: 'test'})
            .clearAuthHeader()
            .postRequest(403);
        expect(response.token).not.shouldBeDefined();
    });

    test('Get video games should list all video games @smoke @VIDEOGAME_API_02', async ({ api}) => {
        const response = await api
            .path('/api/videogame')
            .clearAuthHeader()
            .getRequest(200);
        await expect(response).shouldMatchSchema('videogame', 'GET_videogames');
        expect(Array.isArray(response)).toBeTruthy();
        expect(response.length).shouldBeLessThanOrEqual(10);
    });


    test('Get video game by valid id should return correct video game @smoke @VIDEOGAME_API_03', async ({ api}) => {
        const response = await api
            .path('/api/videogame/{id}')
            .pathParams({'id': '1'})
            .clearAuthHeader()
            .getRequest(200);
        await expect(response).shouldMatchSchema('videogame', 'GET_videogame');
        expect(response.name).shouldEqual('Resident Evil 4');
    });

    test('Get video game by invalid id should not return any video game @VIDEOGAME_API_04', async ({ api}) => {
        const response = await api
            .path('/api/v2/videogame/{id}')
            .pathParams({'id': '99999'})
            .clearAuthHeader()
            .getRequest(404);
    });

    test('Create new video game  @smoke @VIDEOGAME_API_05', async ({ api}) => {
        const request_payload = JSON.parse(JSON.stringify(videogame_payload));
        request_payload.name = `Super Mario 1`;
        const response = await api
            .path('/api/videogame')
            .headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
            .body(request_payload)
            .postRequest(200);
            await expect(response).shouldMatchSchema('videogame', 'POST_videogame');
            expect(response.name).shouldEqual(request_payload.name);
            expect(response.id).shouldBeDefined();    
    });

    test('Create new video game without mandatory field @VIDEOGAME_API_06', async ({ api}) => {
        const request_payload = JSON.parse(JSON.stringify(videogame_payload));
        delete request_payload.name; 
        await api
            .path('/api/videogame')
            .headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
            .body(request_payload)
            .postRequest(400);
    });

    test('Update video game  @smoke @VIDEOGAME_API_07', async ({ api}) => {
        const request_payload = JSON.parse(JSON.stringify(videogame_payload));
        request_payload.name = `Assassin's Creed Odyssey`;
        const response = await api
            .path('/api/videogame/{id}')
            .pathParams({'id': '1'})
            .headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
            .body(request_payload)
            .putRequest(200);
            await expect(response).shouldMatchSchema('videogame', 'PUT_videogame');
            expect(response.name).shouldEqual(request_payload.name);
            expect(response.id).shouldEqual(1);
    });

    test('Update video game without mandatory field @VIDEOGAME_API_08', async ({ api}) => {
        const request_payload = JSON.parse(JSON.stringify(videogame_payload));
        delete request_payload.category; 
        await api
            .path('/api/videogame/{id}')
            .pathParams({'id': '1'})
            .headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            })
            .body(request_payload)
            .putRequest(400);
    });

    test('Delete video game by valid id should delete the video game  @smoke @VIDEOGAME_API_09', async ({ api}) => {
        const response = await api 
            .path('/api/videogame/{id}')
            .pathParams({'id': '1'})
            .deleteRequest(200);
        expect(response).shouldEqual('Video game deleted');
    });

    test('Delete video game from unauthorised user @VIDEOGAME_API_10', async ({ api}) => {
        const response = await api 
            .path('/api/videogame/{id}')
            .pathParams({'id': '1'})
            .clearAuthHeader()
            .deleteRequest(403);
    });

});