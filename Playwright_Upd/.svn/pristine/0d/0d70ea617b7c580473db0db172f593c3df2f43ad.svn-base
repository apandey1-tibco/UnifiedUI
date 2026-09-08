import { APIRequestContext, APIResponse } from "@playwright/test";
import path from "path";
import fs from "fs";

const dataset = JSON.parse(
  JSON.stringify(require("../fixtures/TestData.json"))
);

export class APIUtils {
  readonly contxt: APIRequestContext;

  constructor(contxt: APIRequestContext) {
    this.contxt = contxt;
  }

  file = path.resolve("./fixtures", "OrgNew-dev-2.0.rasc");
  image = fs.readFileSync(this.file);

  async deployProject() {
    const res = await this.contxt.post(
      "http://10.64.197.35/bpm/deploy/v1/deployments",
      {
        headers: {
          Accept: "*/*",
          ContentType: "multipart/form-data",
        },
        multipart: {
          file: {
            name: this.file,
            mimeType: "./fixtures/OrgNew-dev-2.0.rasc",
            buffer: this.image,
          },
        },
      }
    );
    return res;
  }

  async createLDAP() {
    const id = await this.contxt.post(
      "http://10.64.197.35/bpm/organization/v1/ldapContainers",
      {
        data: {
          name: `${dataset.API.ldapName}`,
          description: `${dataset.API.ldapDesc}`,
          primarySource: {
            alias: `${dataset.API.alias}`,
            ldapQuery: {
              query: "(ObjectClass=person)",
              baseDn: "o=easyAsInsurance",
              scope: {
                type: "subtree",
              },
            },
            resourceNameAttr: "ou",
          },
        },
      }
    );
    return id.json();
  }

  //Gets Tony Pilis
  async getResource(id: APIResponse, resourceName: string) {
    const resorces = await this.contxt.post(
      "http://10.64.197.35/bpm/organization/v1/ldapContainers/listCandidateResources",

      {
        data: {
          containerId: id,
          include: "all",
          pageSize: 20,
          bookmark: "",
        },
      }
    );
    const resJson = await resorces.json();
    const arrResources = resJson.candidates;
    let val = "";
    for (let candidate of arrResources) {
      if (candidate.name === resourceName) {
        val = candidate.dn;
        break;
      }
    }
    return val;
  }

  async addResource(id: APIResponse, resource_dn: string) {
    const addRes = await this.contxt.post(
      `http://10.64.197.35/bpm/organization/v1/resources`,
      {
        data: [
          {
            name: dataset.API.resourceName,
            label: dataset.API.labelName,
            containerId: id,
            containerName: dataset.API.ldapName,
            ldapOrigin: {
              containerId: id,
              primaryDn: {
                alias: dataset.API.alias,
                dn: resource_dn,
              },
            },
          },
        ],
      }
    );
    return await addRes.json();
  }

  async getOrgIds() {
    const response = await this.contxt.get(
      "http://10.64.197.35/bpm/organization/v1/orgModels/orgModel",
      {
        params: {
          modelVersion: "2",
        },
      }
    );
    return response.json();
  }

  async mapResources(resourceID: APIResponse, grpId: string) {
    const response = await this.contxt.put(
      `http://10.64.197.35/bpm/organization/v1/entities/${grpId}/resources`,
      {
        data: {
          guid: grpId,
          name: "QA",
          label: "QA",
          refs: [{ guid: resourceID }],
          modelVersion: 2,
        },
      }
    );
    return response;
  }
  async deleteLDAP(id: APIResponse) {
    await this.contxt.delete(
      `http://10.64.197.35/bpm/organization/v1/ldapContainers/${id}`
    );
  }
}
