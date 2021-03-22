# Docker and Virtualization

If you try running docker and get a message regarding virtualization you will need to do the following:

## Windows

Reset your machine through recovery mode by following:

`Windows key > Settings > Update & Security > Recovery > Restart Now`.

When your PC restarts click on `Troubleshoot > Advanced Options > Select UEFI Firmware Settings > Click Restart`.

Once your machine restarts you will be brought to your BIOS settings. Find the `SVM Mode` and **enable** it.

For me, this setting was under `Advanced Settings > CPU Config section`.
Once you have **enabled** the SVM Mode you can Save & Reset your machine.

Open your task manager after your machine restarts.
Open the Performance tab and ensure that Virtualization is now **enabled**.

If opening docker continues to give you an error when opening follow this official [Docker Guide](https://docs.docker.com/docker-for-windows/troubleshoot/)

## [Mac](https://docs.docker.com/docker-for-mac/troubleshoot/)

Mac does not appear to have a virtualization issue at the time of writing this documentation. See below for virtualization information on Mac's.

"Docker Desktop for Mac requires the [Apple Hypervisor framework](https://developer.apple.com/documentation/hypervisor). Docker Desktop is only compatible with Mac systems that have a CPU that supports the Hypervisor framework. Most Macs built in 2010 and later support it, as described in the Apple Hypervisor Framework documentation about supported hardware:

_Generally, machines with an Intel VT-x feature set that includes Extended Page Tables (EPT) and Unrestricted Mode are supported._

To check if your Mac supports the Hypervisor framework, run the following command in a terminal window.

```bash
sysctl kern.hv_support
```

If your Mac supports the Hypervisor Framework, the command prints `kern.hv_support: 1.`

If not, the command prints `kern.hv_support: 0`.

See also, Hypervisor Framework Reference in the Apple documentation, and Docker Desktop [Mac system requirements](https://developer.apple.com/documentation/hypervisor)."

[Source](https://docs.docker.com/docker-for-mac/troubleshoot/)
