import { ManagedResourceStatus } from "@rhoas/smart-events-management-sdk";
import { fireEvent, RenderResult } from "@testing-library/react";
import { customRender, waitForI18n } from "@utils/testUtils";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { BridgeOverview, BridgeOverviewProps } from "./BridgeOverview";

const IngressEndpoint =
  "https://3543edaa-1851-4ad7-96be-ebde7d20d717.apps.openbridge-dev.fdvn.p1.openshiftapps.com/events";

const processorData = [
  {
    kind: "Processor",
    id: "a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
    name: "Processor one",
    type: "sink",
    href: "/api/smartevents_mgmt/v2/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7",
    submitted_at: "2022-04-12T12:10:46.029400+0000",
    published_at: "2022-04-12T12:12:52.416527+0000",
    status: ManagedResourceStatus.Ready,
    flows: [],
    owner: "",
  },
  {
    kind: "Processor",
    id: "fa373030-c0d2-11ec-9d64-0242ac120002",
    name: "Processor two",
    type: "sink",
    href: "/api/smartevents_mgmt/v2/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/fa373030-c0d2-11ec-9d64-0242ac120002",
    submitted_at: "2022-04-15T12:10:46.029400+0000",
    published_at: "2022-04-15T12:12:52.416527+0000",
    status: ManagedResourceStatus.Failed,
    flows: [],
    owner: "",
  },
  {
    kind: "Processor",
    id: "f8f34af4-caed-11ec-9d64-0242ac120002",
    name: "Processor three",
    type: "source",
    href: "/api/smartevents_mgmt/v2/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/f8f34af4-caed-11ec-9d64-0242ac120002",
    submitted_at: "2022-04-15T12:10:46.029400+0000",
    published_at: "2022-04-15T12:12:52.416527+0000",
    status: ManagedResourceStatus.Accepted,
    flows: [],
    owner: "",
  },
  {
    kind: "Processor",
    id: "sourcef4-ead8-6g8v-as8e-0642tdjek002",
    name: "Processor four",
    type: "source",
    href: "/api/smartevents_mgmt/v2/bridges/3543edaa-1851-4ad7-96be-ebde7d20d717/processors/sourcef4-ead8-6g8v-as8e-0642tdjek002",
    submitted_at: " ",
    published_at: "2022-05-15T12:12:52.416527+0000",
    status: ManagedResourceStatus.Accepted,
    flows: [],
    owner: "",
  },
];
const setupBridgeOverview = (
  props: Partial<BridgeOverviewProps>
): { comp: RenderResult } => {
  const {
    onCreateProcessor = jest.fn(),
    instanceId = "3543edaa-1851-4ad7-96be-ebde7d20d717",
    processorList,
    bridgeStatus,
    processorsError,
    bridgeIngressEndpoint,
  } = props;
  const comp = customRender(
    <BrowserRouter>
      <BridgeOverview
        onCreateProcessor={onCreateProcessor}
        instanceId={instanceId}
        processorList={processorList}
        processorsError={processorsError}
        bridgeStatus={bridgeStatus}
        bridgeIngressEndpoint={bridgeIngressEndpoint}
      />
    </BrowserRouter>
  );
  return { comp };
};

describe("Bridge Overview", () => {
  it("should check for getting started card is open by default", async () => {
    const { comp } = setupBridgeOverview({});
    await waitForI18n(comp);
    expect(comp.queryByText("Learn about YAML templates")).toBeInTheDocument();
  });

  it("should check for getting started card is closed, after clicking on toggle button", async () => {
    const { comp } = setupBridgeOverview({});
    await waitForI18n(comp);
    expect(comp.getByLabelText("getting started toggler")).toBeInTheDocument();
    fireEvent.click(comp.getByLabelText("getting started toggler"));
    expect(
      comp.queryByText("Learn about YAML templates")
    ).not.toBeInTheDocument();
  });

  it("should have ingress endpoint", async () => {
    const { comp } = setupBridgeOverview({
      bridgeIngressEndpoint: IngressEndpoint,
    });
    await waitForI18n(comp);

    expect(comp.getByDisplayValue(IngressEndpoint)).toBeInTheDocument();
  });

  it("should display no processor", async () => {
    const { comp } = setupBridgeOverview({ processorList: [] });

    await waitForI18n(comp);

    expect(comp.getByText("No processors")).toBeInTheDocument();
  });

  it("should display list of processors", async () => {
    const { comp } = setupBridgeOverview({
      processorList: processorData,
    });

    await waitForI18n(comp);

    expect(comp.queryByText("No processors")).not.toBeInTheDocument();
    expect(comp.queryByText("Processor one")).toBeInTheDocument();
    expect(comp.queryByText("Processor two")).toBeInTheDocument();
    expect(comp.queryByText("Processor three")).toBeInTheDocument();
    expect(comp.queryByText("Processor four")).toBeInTheDocument();

    expect(comp.getByRole("link", { name: "Processor one" })).toHaveAttribute(
      "href",
      "/instance/3543edaa-1851-4ad7-96be-ebde7d20d717/processor/a72fb8e7-162b-4ae8-9672-f9f5b86fb3d7"
    );
  });

  it("should disable create processor button, when bridgeStatus is failed", async () => {
    const { comp } = setupBridgeOverview({
      bridgeStatus: ManagedResourceStatus.Failed,
    });
    await waitForI18n(comp);

    expect(
      comp.getByRole("button", { name: "Create processor" })
    ).toBeDisabled();
  });

  it("should enable create processor button, when bridgeStatus is ready", async () => {
    const onCreateProcessor = jest.fn();
    const { comp } = setupBridgeOverview({
      bridgeStatus: ManagedResourceStatus.Ready,
      onCreateProcessor,
    });
    await waitForI18n(comp);

    expect(
      comp.getByRole("button", { name: "Create processor" })
    ).toBeEnabled();
    fireEvent.click(comp.getByRole("button", { name: "Create processor" }));
    expect(onCreateProcessor).toHaveBeenCalledTimes(1);
  });

  it("should display generic error message", async () => {
    const { comp } = setupBridgeOverview({
      processorsError: "generic error message",
    });
    await waitForI18n(comp);

    expect(comp.queryByText("Unexpected Error")).toBeInTheDocument();
    expect(
      comp.queryByText(
        "Error while retrieving the list of Processors for this Smart Event instance."
      )
    ).toBeInTheDocument();
  });
});