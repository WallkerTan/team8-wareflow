import { apiClient } from "../client";
import type { DocumentStatus, IssueRequest, IssueResponse, PageResponse } from "../../types";

export interface IssueFilterParams {
    status?: DocumentStatus;
    fromDate?: string;
    toDate?: string;
    page?: number;
    size?: number;
}

export const issueService = {
    getIssues: async (params?: IssueFilterParams): Promise<PageResponse<IssueResponse>> => {
        const response = await apiClient.get<PageResponse<IssueResponse>>("/api/issues", {
            params,
        });
        return response.data;
    },

    getIssue: async (id: number): Promise<IssueResponse> => {
        const response = await apiClient.get<IssueResponse>(`/api/issues/${id}`);
        return response.data;
    },

    createIssue: async (data: IssueRequest): Promise<IssueResponse> => {
        const response = await apiClient.post<IssueResponse>("/api/issues", data);
        return response.data;
    },

    updateIssue: async (id: number, data: IssueRequest): Promise<IssueResponse> => {
        const response = await apiClient.put<IssueResponse>(`/api/issues/${id}`, data);
        return response.data;
    },

    deleteIssue: async (id: number): Promise<void> => {
        await apiClient.delete(`/api/issues/${id}`);
    },

    confirmIssue: async (id: number): Promise<IssueResponse> => {
        const response = await apiClient.post<IssueResponse>(`/api/issues/${id}/confirm`);
        return response.data;
    },

    cancelIssue: async (id: number): Promise<IssueResponse> => {
        const response = await apiClient.post<IssueResponse>(`/api/issues/${id}/cancel`);
        return response.data;
    },
};
