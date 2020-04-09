// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {expect} from 'chai';
import {google} from '../src';
import {describe, it} from 'mocha';
const compute = google.compute('v1');

describe('google.auth', async () => {
  describe('google.auth.getClient', async () => {
    it('allows client to be configured using historical API', async () => {
      const authClient = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      const projectId = await google.auth.getProjectId();
      const result = await compute.instances.aggregatedList({
        auth: authClient,
        project: projectId,
      });
      const vms = result.data;
      expect(vms.kind).to.be.a('string');
    });

    it('uses projectId from cached client', async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const authClient = await google.auth.getClient({
        projectId: 'foo-project-id',
      });
      const projectId = await google.auth.getProjectId();
      expect(projectId).to.equal('foo-project-id');
    });

    it('uses the last configured client settings', async () => {
      let authClient = await google.auth.getClient();
      authClient = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      const projectId = await google.auth.getProjectId();
      const result = await compute.instances.aggregatedList({
        auth: authClient,
        project: projectId,
      });
      const vms = result.data;
      expect(vms.kind).to.be.a('string');
    });
  });

  describe('new google.auth.GoogleAuth', async () => {
    it('allows client to be configured using historical API', async () => {
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/cloud-platform'],
      });
      const authClient = await auth.getClient();
      const projectId = await google.auth.getProjectId();
      const result = await compute.instances.aggregatedList({
        auth: authClient,
        project: projectId,
      });
      const vms = result.data;
      expect(vms.kind).to.be.a('string');
    });
  });
});
