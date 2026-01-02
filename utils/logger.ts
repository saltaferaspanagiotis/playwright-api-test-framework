export class ApiLogger{

    private recentLogs: any[] = [];

    logRequest(method: string, url: string, headers?: Record<string, string>, body?: any){
        const logEntry = {method, url, headers, body, timestamp: new Date().toISOString()};
        this.recentLogs.push({type: 'REQUEST DETAILS', data: logEntry});
    }

    logResponse(statusCode: number, body?: any, headers?: Record<string, string>){
        const logEntry = {statusCode, body, headers, timestamp: new Date().toISOString()};
        this.recentLogs.push({type: 'RESPONSE DETAILS', data: logEntry});
    }  

    getRecentLogs(){
        const logs  = this.recentLogs.map(log => {
            return `---------${log.type}---------\n${JSON.stringify(log.data, null, 4)}`;
        }).join('\n\n');
        return logs;
    }
}