import { afterAll, beforeAll } from "bun:test";
import { $, ShellError, type Subprocess } from "bun";
import { createProcess } from "./process";

export async function stopContainer(container: Subprocess<any>, id: string) {
  try {
    await $`docker stop ${id} > nul`.quiet();
  } catch (e) {
    while (true) {
      if (e instanceof ShellError)
        if (e.stderr.indexOf("No such container") !== -1) break;
      throw e;
    }
  }
  return container.exited;
}

export async function isContainerRunning(name: string) {
  const ps = await $`docker ps`.text();
  return ps.indexOf(name) !== -1;
}

export interface ContainerVars {
  container: Subprocess<any>;
  containerID: string;
}

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export class BunContainerOrchestrator<Vars = {}> {
  private vars: Vars & ContainerVars;
  private onStartCallback?: (vars: Vars & ContainerVars) => Promise<void>;
  private onStopCallback?: (vars: Vars & ContainerVars) => Promise<void>;

  constructor(
    public spawner: () => Promise<ContainerVars>,
    private externalContainerName?: string,
  ) {
    this.vars = Object.create({});
  }

  onStart(cb: (vars: typeof this.vars) => Promise<void>) {
    this.onStartCallback = cb;
    return this;
  }

  onStop(cb: (vars: typeof this.vars) => Promise<void>) {
    this.onStopCallback = cb;
    return this;
  }

  orchestrate() {
    beforeAll(async () => {
      if ((await this.isExternalContainer()) === false) {
        const container = await this.spawner();
        Object.assign(this.vars, container);
      }

      try {
        await this.onStartCallback?.(this.vars);
      } catch (e) {
        await this.stopContainer();
        throw e;
      }
    });

    afterAll(async () => {
      await this.onStopCallback?.(this.vars).finally(
        this.stopContainer.bind(this),
      );
      await this.stopContainer();
    });

    return this.vars;
  }

  private isStopped = false;
  private async stopContainer() {
    if (this.isStopped) return;
    if (this.vars.container == null || this.vars.containerID == null) return;
    if ((await this.isExternalContainer()) === false) {
      await stopContainer(this.vars.container, this.vars.containerID);
      this.isStopped = true;
    }
  }

  private isExternal?: boolean;
  private async isExternalContainer(): Promise<boolean> {
    if (this.isExternal != null) return this.isExternal;

    if (!this.externalContainerName) {
      this.isExternal = false;
      return false;
    }

    this.isExternal = await isContainerRunning(this.externalContainerName);
    return this.isExternal;
  }
}

export namespace Spawner {
  export async function RabbitMQ(hostname: string) {
    const id = crypto.randomUUID();
    const container = await createProcess(
      `docker run --rm --hostname ${hostname} --name ${id} -p 5672:5672 rabbitmq`,
      (line) => {
        return line.indexOf("Server startup complete") !== -1;
      },
    );
    await Bun.sleep(100);
    return { containerID: id, container };
  }

  export async function Redis() {
    const id = crypto.randomUUID();
    const container = await createProcess(
      `docker run --rm -p 6379:6379 --name ${id} redis`,
      (line) => {
        return line.indexOf("Ready to accept connections tcp") !== -1;
      },
    );
    await Bun.sleep(500);

    return { containerID: id, container };
  }

  export async function MongoDB() {
    const id = crypto.randomUUID();
    const container = await createProcess(
      `docker run --rm -p 27017:27017 --name ${id} mongo`,
      (line) => {
        return line.indexOf("mongod startup complete") !== -1;
      },
    );
    await Bun.sleep(500);

    return { containerID: id, container };
  }

  export async function Mailhog() {
    const id = crypto.randomUUID();
    const container = await createProcess(
      `docker run --rm --name ${id} -p 1025:1025 -p 8025:8025 mailhog/mailhog`,
      (line) => {
        return line.indexOf("[SMTP] Binding to address") !== -1;
      },
    );
    await Bun.sleep(100);
    return { containerID: id, container };
  }
}
